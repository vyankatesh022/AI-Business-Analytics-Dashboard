import { NextResponse } from 'next/server';
import { findMockUserByEmail, createMockUser } from '@/utils/mock-db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  try {
    const { action, email, password } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    let user;

    if (action === 'login') {
      user = findMockUserByEmail(email);
      if (!user || (password && user.password !== password)) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    } else if (action === 'signup') {
      try {
        user = createMockUser(email, password);
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Set the mock cookie
    const mockSessionPayload = JSON.stringify({
      user: {
        id: user.id,
        email: user.email,
        aud: "authenticated",
        role: "authenticated"
      }
    });

    const cookieStore = await cookies();
    cookieStore.set('vibe_mock_auth', mockSessionPayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      path: '/'
    });

    // Remove password before sending to client
    const { password: _, ...safeUser } = user;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  const cookieStore = await cookies();
  cookieStore.delete('vibe_mock_auth');
  return NextResponse.json({ success: true });
}
