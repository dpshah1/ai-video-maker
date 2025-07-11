from manim import *

class PublicKeyCryptography(Scene):
    def construct(self):
        title = Text("Public Key Cryptography", font_size=48)
        rsa_text = Text("RSA: A Key Exchange Method", font_size=36)
        key_image = Circle(radius=0.5, color=BLUE).shift(LEFT * 2)
        lock_image = Circle(radius=0.5, color=YELLOW).shift(RIGHT * 2)

        self.play(Write(title))
        self.wait(1)
        self.play(Transform(title, rsa_text))
        self.wait(1)
        self.play(FadeIn(key_image), FadeIn(lock_image))
        self.wait(1.8)

        self.play(FadeOut(title), FadeOut(key_image), FadeOut(lock_image))
        self.wait(1)